import React, { useEffect, useState } from 'react';
import { Dropdown } from '@carbon/react';
import { useField } from 'formik';
import { createErrorHandler } from '@openmrs/esm-framework';
import { getConceptNameAndUUID } from '../../../utils/form-helper';
import { getLocationsByTag } from '../../../api/api';
import { isTrue } from '../../../utils/boolean-utils';
import { FormField } from '../../../types';
import { FormContext } from '../../../form-context';
import { FieldValueView } from '../../value/view/field-value-view.component';
import styles from './encounter-location.scss';

export const EncounterLocationPicker: React.FC<{ question: FormField; onChange: any }> = ({ question }) => {
  const [field, meta] = useField(question.id);
  const { setEncounterLocation, setFieldValue, encounterContext } = React.useContext(FormContext);
  const [locations, setLocations] = useState([]);
  const [conceptName, setConceptName] = useState('Loading...');

  useEffect(() => {
    if (question.questionOptions.locationTag) {
      getLocationsByTag(
        question.questionOptions.locationTag
          .trim()
          .split(' ')
          .join('%20'),
      ).subscribe(
        results => setLocations(results),
        error => createErrorHandler(),
      );
    }
  }, []);

  useEffect(() => {
    getConceptNameAndUUID(question.questionOptions.concept).then(conceptTooltip => {
      setConceptName(conceptTooltip);
    });
  }, [conceptName]);

  return encounterContext.sessionMode == 'view' || isTrue(question.readonly) ? (
    <div className={styles.formField}>
      <FieldValueView
        label={question.label}
        value={field.value ? field.value.display : field.value}
        conceptName={conceptName}
        isInline
      />
    </div>
  ) : (
    !question.isHidden && (
      <div className={`${styles.formInputField} ${styles.multiselectOverride} ${styles.flexRow}`}>
        <Dropdown
          id={question.id}
          titleText={question.label}
          label="Choose location"
          items={locations}
          itemToString={item => item.display}
          selectedItem={field.value}
          onChange={({ selectedItem }) => {
            setFieldValue(question.id, selectedItem);
            setEncounterLocation(selectedItem);
          }}
          disabled={question.disabled}
        />
      </div>
    )
  );
};
