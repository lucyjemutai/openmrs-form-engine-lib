import { SubmissionHandler } from '..';
import { OpenmrsEncounter, FormField } from '../types';
import { EncounterContext } from '../form-context';

export const EncounterDatetimeHandler: SubmissionHandler = {
  handleFieldSubmission: (field: FormField, value: any, context: EncounterContext) => {
    context.setEncounterDate(value);
    return value;
  },
  getInitialValue: (encounter: OpenmrsEncounter, field: FormField, allFormFields?: FormField[]) => {
    return new Date(); // TO DO: pick it from the visit if present
  },

  getDisplayValue: (field: FormField, value: any) => {
    return field.value ? field.value : null;
  },
  getPreviousValue: (field: FormField, value: any) => {
    return null;
  },
};
