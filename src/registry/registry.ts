import { getGlobalStore } from '@openmrs/esm-framework';
import { ContentSwitcher } from '../components/inputs/content-switcher/content-switcher.component';
import { DateValidator } from '../validators/date-validator';
import { ExpressionValidator } from '../validators/js-expression-validator';
import { EncounterDatetimeHandler } from '../submission-handlers/encounterDatetimeHandler';
import { EncounterLocationPicker } from '../components/inputs/location/encounter-location.component';
import { EncounterLocationSubmissionHandler, ObsSubmissionHandler } from '../submission-handlers/base-handlers';
import { FieldValidator } from '../validators/form-validator';
import { FormFieldValidator, PostSubmissionAction, SubmissionHandler } from '../types';
import { FormsStore } from '../constants';
import { ObsGroup } from '../components/group/obs-group.component';
import { MultiSelect } from '../components/inputs/multi-select/multi-select.component';
import { RepeatingField } from '../components/repeat/repeat.component';
import DateField from '../components/inputs/date/date.component';
import Dropdown from '../components/inputs/select/dropdown.component';
import ExtensionParcel from '../components/extension/extension-parcel.component';
import FixedValue from '../components/inputs/fixed-value/fixed-value.component';
import Markdown from '../components/inputs/markdown/markdown.component';
import Number from '../components/inputs/number/number.component';
import Radio from '../components/inputs/radio/radio.component';
import TextAreaField from '../components/inputs/text-area/text-area.component';
import Text from '../components/inputs/text/text.component';
import Toggle from '../components/inputs/toggle/toggle.component';

export interface RegistryItem {
  id: string;
  component: any;
  type?: string;
}

export interface ComponentRegistration {
  id: string;
  load: () => Promise<any>;
}

export interface PostSubmissionActionRegistration extends ComponentRegistration {
  load: () => Promise<{ default: PostSubmissionAction }>;
}

export interface CustomControlRegistration extends Omit<ComponentRegistration, 'load'> {
  loadControl: () => Promise<any>;
  type: string;
  alias?: string;
}
interface ValidatorRegistryItem extends RegistryItem {
  component: FormFieldValidator;
}

export interface FormsRegistryStoreState {
  customControls: Array<CustomControlRegistration>;
  postSubmissionActions: Array<PostSubmissionActionRegistration>;
}

export const baseFieldComponents: Array<CustomControlRegistration> = [
  {
    id: 'Text',
    loadControl: () => Promise.resolve({ default: Text }),
    type: 'text',
    alias: '',
  },
  {
    id: 'Radio',
    loadControl: () => Promise.resolve({ default: Radio }),
    type: 'radio',
    alias: '',
  },
  {
    id: 'DateField',
    loadControl: () => Promise.resolve({ default: DateField }),
    type: 'date',
    alias: '',
  },
  {
    id: 'Number',
    loadControl: () => Promise.resolve({ default: Number }),
    type: 'number',
    alias: 'numeric',
  },
  {
    id: 'MultiSelect',
    loadControl: () => Promise.resolve({ default: MultiSelect }),
    type: 'checkbox',
    alias: 'multiCheckbox',
  },
  {
    id: 'ContentSwitcher',
    loadControl: () => Promise.resolve({ default: ContentSwitcher }),
    type: 'content-switcher',
    alias: '',
  },
  {
    id: 'EncounterLocationPicker',
    loadControl: () => Promise.resolve({ default: EncounterLocationPicker }),
    type: 'encounter-location',
    alias: '',
  },
  {
    id: 'Dropdown',
    loadControl: () => Promise.resolve({ default: Dropdown }),
    type: 'select',
    alias: '',
  },
  {
    id: 'TextAreaField',
    loadControl: () => Promise.resolve({ default: TextAreaField }),
    type: 'textarea',
    alias: '',
  },
  {
    id: 'Toggle',
    loadControl: () => Promise.resolve({ default: Toggle }),
    type: 'toggle',
    alias: '',
  },
  {
    id: 'ObsGroup',
    loadControl: () => Promise.resolve({ default: ObsGroup }),
    type: 'group',
    alias: '',
  },
  {
    id: 'RepeatingField',
    loadControl: () => Promise.resolve({ default: RepeatingField }),
    type: 'repeating',
    alias: '',
  },
  {
    id: 'FixedValue',
    loadControl: () => Promise.resolve({ default: FixedValue }),
    type: 'fixed-value',
    alias: '',
  },
  {
    id: 'Markdown',
    loadControl: () => Promise.resolve({ default: Markdown }),
    type: 'markdown',
    alias: '',
  },
  {
    id: 'ExtensionParcel',
    loadControl: () => Promise.resolve({ default: ExtensionParcel }),
    type: 'extension-widget',
    alias: '',
  },
  {
    id: 'DateTime',
    loadControl: () => Promise.resolve({ default: DateField }),
    type: 'datetime',
    alias: '',
  },
];

const baseHandlers: Array<RegistryItem> = [
  {
    id: 'ObsSubmissionHandler',
    component: ObsSubmissionHandler,
    type: 'obs',
  },
  {
    id: 'ObsGroupHandler',
    component: ObsSubmissionHandler,
    type: 'obsGroup',
  },
  {
    id: 'EncounterLocationSubmissionHandler',
    component: EncounterLocationSubmissionHandler,
    type: 'encounterLocation',
  },
  {
    id: 'EncounterDatetimeHandler',
    component: EncounterDatetimeHandler,
    type: 'encounterDatetime',
  },
];

const fieldValidators: Array<ValidatorRegistryItem> = [
  {
    id: 'BaseValidator',
    component: FieldValidator,
  },
  {
    id: 'date',
    component: DateValidator,
  },
  {
    id: 'js_expression',
    component: ExpressionValidator,
  },
];

export const getFieldComponent = renderType => {
  let lazy = baseFieldComponents.find(item => item.type == renderType || item?.alias == renderType)?.loadControl;
  if (!lazy) {
    lazy = getFormsStore().customControls.find(item => item.type == renderType || item?.alias == renderType)
      ?.loadControl;
  }
  return lazy?.();
};

export function getHandler(type: string): SubmissionHandler {
  return baseHandlers.find(handler => handler.type == type)?.component;
}

export function addHandler(handler: RegistryItem) {
  baseHandlers.push(handler);
}

export function addValidator(validator: ValidatorRegistryItem) {
  if (validator) {
    fieldValidators.push(validator);
  }
}

function getFormsStore(): FormsRegistryStoreState {
  return getGlobalStore<FormsRegistryStoreState>(FormsStore, {
    customControls: [],
    postSubmissionActions: [],
  }).getState();
}

export function getValidator(id: string): FormFieldValidator {
  return fieldValidators.find(validator => validator.id == id)?.component || fieldValidators[0].component;
}

export function registerControl(registration: CustomControlRegistration) {
  getFormsStore().customControls.push(registration);
}

export function registerPostSubmissionAction(registration: PostSubmissionActionRegistration) {
  getFormsStore().postSubmissionActions.push(registration);
}

export function getPostSubmissionActionById(actionId: string) {
  const lazy = getFormsStore().postSubmissionActions.find(registration => registration.id == actionId)?.load;
  if (lazy) {
    return lazy();
  } else {
    console.error(`No loader found for PostSubmissionAction registration of id: ${actionId}`);
  }
  return null;
}
