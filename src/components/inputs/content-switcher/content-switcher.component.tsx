import React, { useEffect, useMemo, useState } from 'react';
import { FormGroup, ContentSwitcher as Switcher, Switch } from '@carbon/react';
import { useField } from 'formik';
import { getConceptNameAndUUID, isInlineView } from '../../../utils/form-helper';
import { isTrue } from '../../../utils/boolean-utils';
import { FieldValueView } from '../../value/view/field-value-view.component';
import { FormContext } from '../../../form-context';
import { FormFieldProps } from '../../../types';
import styles from './content-switcher.scss';

export const ContentSwitcher: React.FC<FormFieldProps> = ({ question, onChange, handler }) => {
  const [field, meta] = useField(question.id);
  const { setFieldValue, encounterContext, layoutType, workspaceLayout } = React.useContext(FormContext);
  const [errors, setErrors] = useState([]);
  const [conceptName, setConceptName] = useState('Loading...');

  useEffect(() => {
    if (question['submission']?.errors) {
      setErrors(question['submission']?.errors);
    }
  }, [question['submission']]);

  const handleChange = value => {
    setFieldValue(question.id, value?.name);
    onChange(question.id, value?.name, setErrors, null);
    question.value = handler?.handleFieldSubmission(question, value?.name, encounterContext);
  };
  const selectedIndex = useMemo(
    () => question.questionOptions.answers.findIndex(option => option.concept == field.value),
    [field.value],
  );

  useEffect(() => {
    getConceptNameAndUUID(question.questionOptions.concept).then(conceptTooltip => {
      setConceptName(conceptTooltip);
    });
  }, [conceptName]);

  const isInline = useMemo(() => {
    if (encounterContext.sessionMode == 'view' || isTrue(question.readonly)) {
      return isInlineView(question.inlineRendering, layoutType, workspaceLayout);
    }
    return false;
  }, [encounterContext.sessionMode, question.readonly, question.inlineRendering, layoutType, workspaceLayout]);

  return encounterContext.sessionMode == 'view' || isTrue(question.readonly) ? (
    <div className={styles.formField}>
      <FieldValueView
        label={question.label}
        value={field.value ? handler?.getDisplayValue(question, field.value) : field.value}
        conceptName={conceptName}
        isInline={isInline}
      />
    </div>
  ) : (
    !question.isHidden && (
      <div className={styles.textContainer}>
        <FormGroup legendText={question.label} className={errors.length ? styles.errorLegend : ''}>
          <Switcher onChange={handleChange} selectedIndex={selectedIndex} className={styles.selectedOption}>
            {question.questionOptions.answers.map((option, index) => (
              <Switch
                className={selectedIndex === index ? styles.switchOverrides : styles.sansSwitchOverrides}
                name={option.concept || option.value}
                text={option.label}
                key={index}
                disabled={question.disabled}
              />
            ))}
          </Switcher>
        </FormGroup>
      </div>
    )
  );
};
