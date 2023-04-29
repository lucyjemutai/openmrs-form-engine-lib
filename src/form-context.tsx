import React from 'react';
import { LayoutType } from '@openmrs/esm-framework';
import { FormField, OpenmrsEncounter, SessionMode } from './types';

type FormContextProps = {
  values: Record<string, any>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  setEncounterLocation: (value: any) => void;
  obsGroupsToVoid: Array<any>;
  setObsGroupsToVoid: (value: any) => void;
  encounterContext: EncounterContext;
  fields: FormField[];
  isFieldInitializationComplete: boolean;
  isSubmitting: boolean;
  layoutType?: LayoutType;
  workspaceLayout?: 'minimized' | 'maximized';
};

export interface EncounterContext {
  patient: fhir.Patient;
  encounter: OpenmrsEncounter;
  previousEncounter?: OpenmrsEncounter;
  location: any;
  sessionMode: SessionMode;
  encounterDate: Date;
  setEncounterDate(value: Date): void;
}

export const FormContext = React.createContext<FormContextProps | undefined>(undefined);
