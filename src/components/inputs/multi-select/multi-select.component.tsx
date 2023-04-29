import React, { useEffect, useMemo, useState } from 'react';
import { FilterableMultiSelect, UnorderedList } from '@carbon/react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { FieldValueView } from '../../value/view/field-value-view.component';
import { FormContext } from '../../../form-context';
import { FormFieldProps } from '../../../types';
import { ValueEmpty } from '../../value/value.component';
import { fieldRequiredErrCode } from '../../../validators/form-validator';
import { getConceptNameAndUUID, isInlineView } from '../../../utils/form-helper';
import { isTrue } from '../../../utils/boolean-utils';
import styles from './multi-select.scss';

export const MultiSelect: React.FC<FormFieldProps> = ({ question, onChange, handler }) => {
  const { t } = useTranslation();
  const [field, meta] = useField(question.id);
  const { setFieldValue, encounterContext, layoutType, workspaceLayout } = React.useContext(FormContext);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [counter, setCounter] = useState(0);
  const [touched, setTouched] = useState(false);
  const [conceptName, setConceptName] = useState('Loading...');
  const isFieldRequiredError = useMemo(() => errors[0]?.errCode == fieldRequiredErrCode, [errors]);

  useEffect(() => {
    // Carbon's MultiSelect has issues related to not updating the component based on the `initialSelectedItems` prop
    // this is an intermittent issue. As a temporary solution, were are forcing the component to re-render
    if (field.value && field.value.length == 0) {
      // chances are high the value was cleared
      // force the Multiselect component to be re-mounted
      setCounter(counter + 1);
    } else if (!touched && question.value) {
      setCounter(counter + 1);
    }
  }, [field.value]);

  useEffect(() => {
    if (question['submission']) {
      question['submission'].errors && setErrors(question['submission'].errors);
      question['submission'].warnings && setWarnings(question['submission'].warnings);
    }
  }, [question['submission']]);

  const questionItems = question.questionOptions.answers.map((option, index) => ({
    id: `${question.id}-${option.concept}`,
    concept: option.concept,
    label: option.label,
    key: index,
  }));

  const initialSelectedItems = [];

  questionItems.forEach(item => {
    if (field.value?.includes(item.concept)) {
      initialSelectedItems.push(item);
    }
  });

  const handleSelectItemsChange = ({ selectedItems }) => {
    setTouched(true);
    const value = selectedItems.map(selectedItem => selectedItem.concept);
    setFieldValue(question.id, value);
    onChange(question.id, value, setErrors, setWarnings);
    question.value = handler?.handleFieldSubmission(question, value, encounterContext);
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
      <FieldValueView
        label={question.label}
        value={field.value ? handler?.getDisplayValue(question, field.value) : field.value}
        conceptName={conceptName}
        isInline={isInline}
      />
    </div>
  ) : (
    !question.isHidden && (
      <>
        <div
          className={
            isFieldRequiredError
              ? `${styles.multiselectOverride} ${styles.errorLabel}`
              : `${styles.multiselectOverride}`
          }>
          <FilterableMultiSelect
            placeholder={t('filterItemsInMultiselect', 'Search...')}
            onChange={handleSelectItemsChange}
            id={question.label}
            items={questionItems}
            initialSelectedItems={initialSelectedItems}
            label={''}
            titleText={question.label}
            key={counter}
            itemToString={item => (item ? item.label : ' ')}
            disabled={question.disabled}
            invalid={!isFieldRequiredError && errors.length > 0}
            invalidText={errors[0]?.message}
            warn={warnings.length > 0}
            warnText={warnings[0]?.message}
          />
        </div>
        <div className={styles.formField} style={{ marginTop: '0.125rem' }}>
          {field.value?.length ? (
            <UnorderedList className={styles.list}>
              {handler?.getDisplayValue(question, field.value)?.map(displayValue => displayValue + ', ')}
            </UnorderedList>
          ) : (
            <ValueEmpty />
          )}
        </div>
      </>
    )
  );
};
