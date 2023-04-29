import React, { useEffect, useMemo, useState } from 'react';
import { Toggle as ToggleInput } from '@carbon/react';
import { FormFieldProps } from '../../../types';
import { useField } from 'formik';
import { FormContext } from '../../../form-context';
import { isTrue } from '../../../utils/boolean-utils';
import { getConceptNameAndUUID, isInlineView } from '../../../utils/form-helper';
import { FieldValueView } from '../../value/view/field-value-view.component';
import { isEmpty } from '../../../validators/form-validator';
import styles from './toggle.scss';

const Toggle: React.FC<FormFieldProps> = ({ question, onChange, handler }) => {
  const [field, meta] = useField(question.id);
  const { setFieldValue, encounterContext, layoutType, workspaceLayout } = React.useContext(FormContext);
  const [conceptName, setConceptName] = useState('Loading...');
  const handleChange = value => {
    setFieldValue(question.id, value);
    onChange(question.id, value, null, null);
    question.value = handler?.handleFieldSubmission(question, value, encounterContext);
  };

  useEffect(() => {
    // The toogle input doesn't support blank values
    // by default, the value should be false
    if (!question.value && encounterContext.sessionMode == 'enter') {
      question.value = handler?.handleFieldSubmission(question, field.value ?? false, encounterContext);
    }
  }, []);

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
        value={!isEmpty(field.value) ? handler?.getDisplayValue(question, field.value) : field.value}
        conceptName={conceptName}
        isInline={isInline}
      />
    </div>
  ) : (
    !question.isHidden && (
      <div className={styles.formField}>
        <ToggleInput
          labelText={question.label}
          id={question.id}
          labelA={question.questionOptions.toggleOptions.labelFalse}
          labelB={question.questionOptions.toggleOptions.labelTrue}
          onToggle={handleChange}
          toggled={!!field.value}
          disabled={question.disabled}
        />
      </div>
    )
  );
};

export default Toggle;
