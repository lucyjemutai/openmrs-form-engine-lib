import React, { useEffect, useState } from 'react';
import { useField } from 'formik';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastNotification } from '@carbon/react';
import { getFieldComponent, getHandler } from '../../registry/registry';
import { isTrue } from '../../utils/boolean-utils';
import { UnspecifiedField } from '../inputs/unspecified/unspecified.component';
import { FormField, FormFieldProps } from '../../types';
import styles from './form-section.scss';

const FormSection = ({ fields, onFieldChange }) => {
  const [fieldToControlMap, setFieldToControlMap] = useState([]);

  useEffect(() => {
    Promise.all(
      fields.map(field => {
        return getFieldControl(field)?.then(result => ({ field, control: result.default }));
      }),
    ).then(results => {
      setFieldToControlMap(results);
    });
  }, [fields]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
      <div className={styles.sectionContainer}>
        {fieldToControlMap
          .filter(entry => !!entry)
          .map((entry, index) => {
            const { control, field } = entry;
            if (control) {
              const questionFragment = React.createElement<FormFieldProps>(control, {
                question: field,
                onChange: onFieldChange,
                key: index,
                handler: getHandler(field.type),
                useField,
              });
              return supportsUnspecified(field) && field.questionOptions.rendering != 'group' ? (
                <div key={index}>
                  {questionFragment}
                  <UnspecifiedField question={field} />
                </div>
              ) : (
                <div key={index}>{questionFragment}</div>
              );
            }
          })}
      </div>
    </ErrorBoundary>
  );
};

function ErrorFallback({ error }) {
  // TODOS:
  // 1. Handle internationalization
  // 2. Show a more descriptive error message about the field
  return (
    <ToastNotification
      ariaLabel="closes notification"
      caption=""
      hideCloseButton
      lowContrast
      onClose={function noRefCheck() {}}
      onCloseButtonClick={function noRefCheck() {}}
      statusIconDescription="notification"
      subtitle={`Message: ${error.message}`}
      title="Error rendering field"
    />
  );
}

export function getFieldControl(question: FormField) {
  if (isMissingConcept(question)) {
    // just render a disabled text input
    question.disabled = true;
    return getFieldComponent('text');
  }
  return getFieldComponent(question.questionOptions.rendering);
}

export function supportsUnspecified(question: FormField) {
  return (
    isTrue(question.unspecified) &&
    question.questionOptions.rendering != 'toggle' &&
    question.questionOptions.rendering != 'encounter-location'
  );
}

function isMissingConcept(question: FormField) {
  return (
    question.type == 'obs' && !question.questionOptions.concept && question.questionOptions.rendering !== 'fixed-value'
  );
}

export default FormSection;
