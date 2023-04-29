import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Checkbox } from '@carbon/react';
import { useField } from 'formik';
import { FormContext } from '../../../form-context';
import { FieldValidator } from '../../../validators/form-validator';
import { FormField } from '../../../types';
import { isTrue } from '../../../utils/boolean-utils';
import styles from './unspecified.scss';

export const UnspecifiedField: React.FC<{
  question: FormField;
}> = ({ question }) => {
  const [field, meta] = useField(`${question.id}-unspecified`);
  const { setFieldValue, encounterContext } = useContext(FormContext);
  const [previouslyUnspecified, setPreviouslyUnspecified] = useState(false);
  const hideCheckBox = encounterContext.sessionMode == 'view';

  useEffect(() => {
    if (field.value) {
      setPreviouslyUnspecified(true);
      question['submission'] = {
        unspecified: true,
        errors: [],
        warnings: [],
      };
      let emptyValue = null;
      switch (question.questionOptions.rendering) {
        case 'date':
          emptyValue = '';
          break;
        case 'checkbox':
          emptyValue = [];
      }
      setFieldValue(question.id, emptyValue);
      question.value = null;
    } else if (previouslyUnspecified && !question.value) {
      question['submission'] = {
        unspecified: false,
        errors: FieldValidator.validate(question, null),
      };
    }
  }, [field.value]);

  useEffect(() => {
    if (question.value) {
      setFieldValue(`${question.id}-unspecified`, false);
    }
  }, [question.value]);

  const handleOnChange = useCallback(value => {
    setFieldValue(`${question.id}-unspecified`, value.target.checked);
  }, []);

  return (
    !question.isHidden &&
    !isTrue(question.readonly) &&
    !hideCheckBox && (
      <div className={styles.unspecified}>
        <Checkbox
          id={`${question.id}-unspecified`}
          labelText="UnspecifiedField"
          value="UnspecifiedField"
          onChange={handleOnChange}
          checked={field.value}
          disabled={question.disabled}
        />
      </div>
    )
  );
};
