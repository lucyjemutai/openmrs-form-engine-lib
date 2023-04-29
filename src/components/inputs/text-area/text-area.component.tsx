import React, { useEffect, useMemo, useState } from 'react';
import { TextArea as TextAreaInput } from '@carbon/react';
import { useField } from 'formik';
import { fieldRequiredErrCode } from '../../../validators/form-validator';
import { getConceptNameAndUUID, isInlineView } from '../../../utils/form-helper';
import { isTrue } from '../../../utils/boolean-utils';
import { FieldValueView } from '../../value/view/field-value-view.component';
import { FormContext } from '../../../form-context';
import { FormFieldProps } from '../../../types';
import styles from './text-area.scss';

const TextArea: React.FC<FormFieldProps> = ({ question, onChange, handler }) => {
  const [field, meta] = useField(question.id);
  const { setFieldValue, encounterContext, layoutType, workspaceLayout } = React.useContext(FormContext);
  const [previousValue, setPreviousValue] = useState();
  const [errors, setErrors] = useState([]);
  const [conceptName, setConceptName] = useState('Loading...');
  const isFieldRequiredError = useMemo(() => errors[0]?.errCode == fieldRequiredErrCode, [errors]);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (question['submission']) {
      question['submission'].errors && setErrors(question['submission'].errors);
      question['submission'].warnings && setWarnings(question['submission'].warnings);
    }
  }, [question['submission']]);

  field.onBlur = () => {
    if (field.value && question.unspecified) {
      setFieldValue(`${question.id}-unspecified`, false);
    }
    if (previousValue !== field.value) {
      onChange(question.id, field.value, setErrors, setWarnings);
      question.value = handler?.handleFieldSubmission(question, field.value, encounterContext);
    }
  };

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
      <FieldValueView label={question.label} value={field.value} conceptName={conceptName} isInline={isInline} />
    </div>
  ) : (
    !question.isHidden && (
      <div className={styles.formField}>
        <div
          className={
            isFieldRequiredError ? `${styles.textInputOverrides} ${styles.errorLabel}` : styles.textInputOverrides
          }>
          <TextAreaInput
            {...field}
            id={question.id}
            labelText={question.label}
            name={question.id}
            value={field.value || ''}
            onFocus={() => setPreviousValue(field.value)}
            rows={question.questionOptions.rows || 4}
            disabled={question.disabled}
            invalid={!isFieldRequiredError && errors.length > 0}
            invalidText={errors.length && errors[0].message}
            warn={warnings.length > 0}
            warnText={warnings.length && warnings[0].message}
          />
        </div>
      </div>
    )
  );
};

export default TextArea;
