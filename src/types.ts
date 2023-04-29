import { OpenmrsResource } from '@openmrs/esm-framework';
import { FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik';
import { EncounterContext } from './form-context';

/**
 * Defines logic that processes field submission and value binding while in edit mode
 */
export interface SubmissionHandler {
  /**
   * Abstraction of the extraction of initial field value from an `encounter`
   *
   * @returns the `initialValue`
   */
  getInitialValue: (encounter: OpenmrsEncounter, field: FormField, allFormFields?: Array<FormField>) => {};

  /**
   * Handles field submission.
   *
   * @should Construct a new submission value, edit and handle deletion by voiding.
   * @returns the `submissionValue`
   */
  handleFieldSubmission: (field: FormField, value: any, context: EncounterContext) => {};

  /**
   * Extracts value to be displayed while in `view` mode
   *
   * @returns the `displayValue`
   */
  getDisplayValue: (field: FormField, value: any) => any;

  /**
   * Fetches the previous value for a formfield
   */
  getPreviousValue?: (field: FormField, encounter: OpenmrsEncounter, allFormFields: Array<FormField>) => any;
}

/**
 * Field validator abstraction
 */
export interface FormFieldValidator {
  /**
   * Validates a field and returns validation errors
   */
  validate(field: FormField, value: any, config?: any): Array<ValidationResult>;
}

export interface ValidationResult {
  resultType: 'warning' | 'error';
  errCode?: string;
  message: string;
}

export interface HideProps {
  hideWhenExpression: string;
}

export interface OHRIFormSchema {
  name: string;
  pages: Array<FormPage>;
  processor: string;
  uuid: string;
  referencedForms: [];
  encounterType: string;
  encounter?: string | OpenmrsEncounter;
  allowUnspecifiedAll?: boolean;
  defaultPage?: string;
  readonly?: string | boolean;
  inlineRendering?: 'single-line' | 'multiline' | 'automatic';
  markdown?: any;
  postSubmissionActions?: Array<string>;
  formOptions?: {
    usePreviousValueDisabled: boolean;
  };
  version?: string;
}

export interface FormPage {
  label: string;
  isHidden?: boolean;
  hide?: HideProps;
  sections: Array<FormSection>;
  isSubform?: boolean;
  inlineRendering?: 'single-line' | 'multiline' | 'automatic';
  readonly?: string | boolean;
  subform?: {
    name?: string;
    package?: string;
    behaviours?: Array<any>;
    form: Omit<OHRIFormSchema, 'postSubmissionActions'>;
  };
}
export interface FormField {
  label: string;
  type: string;
  questionOptions: FormQuestionOptions;
  id: string;
  questions?: Array<FormField>;
  value?: any;
  hide?: HideProps;
  isHidden?: boolean;
  isParentHidden?: boolean;
  fieldDependants?: Set<string>;
  pageDependants?: Set<string>;
  sectionDependants?: Set<string>;
  required?: boolean;
  unspecified?: boolean;
  disabled?: boolean;
  readonly?: string | boolean;
  inlineRendering?: 'single-line' | 'multiline' | 'automatic';
  validators?: Array<Record<string, any>>;
  behaviours?: Array<Record<string, any>>;
}

export interface FormFieldProps {
  question: FormField;
  onChange: (
    fieldName: string,
    value: any,
    setErrors: (errors: Array<ValidationResult>) => void,
    setWarnings: (warnings: Array<ValidationResult>) => void,
  ) => void;
  handler: SubmissionHandler;
  // This is of util to components defined out of the engine
  useField?: (fieldId: string) => [FieldInputProps<any>, FieldMetaProps<any>, FieldHelperProps<any>];
}

export interface FormSection {
  hide?: HideProps;
  label: string;
  isExpanded: string;
  isHidden?: boolean;
  isParentHidden?: boolean;
  questions: Array<FormField>;
  inlineRendering?: 'single-line' | 'multiline' | 'automatic';
  readonly?: string | boolean;
}

export interface FormQuestionOptions {
  extensionId?: string;
  extensionSlotName?: string;
  rendering: RenderType;
  concept?: string;
  /**
   * max and min are used to validate number field values
   */
  max?: string;
  min?: string;
  /**
   * maxLength and maxLength are used to validate text field length
   */
  maxLength?: string;
  minLength?: string;
  showDate?: string;
  conceptMappings?: Array<Record<any, any>>;
  answers?: Array<Record<any, any>>;
  weeksList?: string;
  locationTag?: string;
  rows?: number;
  toggleOptions?: { labelTrue: string; labelFalse: string };
  repeatOptions?: { addText?: string; limit?: string };
  defaultValue?: any;
  calculate?: {
    calculateExpression: string;
  };
  isDateTime?: { labelTrue: boolean; labelFalse: boolean };
  usePreviousValueDisabled?: boolean;
}

export type SessionMode = 'edit' | 'enter' | 'view';

export type RenderType =
  | 'checkbox'
  | 'content-switcher'
  | 'date'
  | 'datetime'
  | 'encounter-location'
  | 'fixed-value'
  | 'group'
  | 'number'
  | 'radio'
  | 'repeating'
  | 'select'
  | 'text'
  | 'textarea'
  | 'toggle'
  | 'ui-select-extended';

export interface PostSubmissionAction {
  applyAction(formSession: {
    patient: fhir.Patient;
    encounters: Array<OpenmrsEncounter>;
    sessionMode: SessionMode;
  }): void;
}

// OpenMRS Type Definitions
export interface OpenmrsEncounter {
  uuid?: string;
  encounterDatetime?: string | Date;
  patient?: OpenmrsResource | string;
  location?: OpenmrsResource | string;
  encounterType?: OpenmrsResource | string;
  obs?: Array<OpenmrsObs>;
  orders?: Array<OpenmrsResource>;
  voided?: boolean;
  visit?: OpenmrsResource | string;
  encounterProviders?: Array<Record<string, any>>;
  form?: {
    uuid: string;
  };
}

export interface OpenmrsObs extends OpenmrsResource {
  concept: OpenmrsResource;
  obsDatetime: string | Date;
  obsGroup: OpenmrsObs;
  groupMembers: Array<OpenmrsObs>;
  comment: string;
  location: OpenmrsResource;
  order: OpenmrsResource;
  encounter: OpenmrsResource;
  voided: boolean;
  value: any;
  formFieldPath: string;
  formFieldNamespace: string;
  status: string;
  interpretation: string;
  [anythingElse: string]: any;
}

export interface OpenmrsForm {
  uuid: string;
  name: string;
  encounterType: OpenmrsResource;
  version: string;
  description: string;
  published: boolean;
  retired: boolean;
  resources: Array<OpenmrsFormResource>;
}

export interface OpenmrsFormResource extends OpenmrsResource {
  dataType: string;
  valueReference: string;
}
