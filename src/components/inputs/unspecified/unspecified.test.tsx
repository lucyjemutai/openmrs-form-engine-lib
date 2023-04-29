import { fireEvent, render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import React from 'react';
import { FormField, EncounterContext, FormContext } from '../../..';
import { UnspecifiedField } from './unspecified.component';

const question: FormField = {
  label: 'Visit Date',
  type: 'obs',
  questionOptions: {
    rendering: 'date',
    concept: '163260AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  },
  id: 'visit-date',
};

const encounterContext: EncounterContext = {
  patient: {
    id: '833db896-c1f0-11eb-8529-0242ac130003',
  },
  location: {
    uuid: '41e6e516-c1f0-11eb-8529-0242ac130003',
  },
  encounter: {
    uuid: '873455da-3ec4-453c-b565-7c1fe35426be',
    obs: [],
  },
  sessionMode: 'enter',
  encounterDate: new Date(2020, 11, 29),
  setEncounterDate: value => {},
};

const renderForm = intialValues => {
  render(
    <Formik initialValues={intialValues} onSubmit={null}>
      {props => (
        <Form>
          <FormContext.Provider
            value={{
              values: props.values,
              setFieldValue: props.setFieldValue,
              setEncounterLocation: jest.fn(),
              obsGroupsToVoid: [],
              setObsGroupsToVoid: jest.fn(),
              encounterContext: encounterContext,
              fields: [question],
              isFieldInitializationComplete: true,
              isSubmitting: false,
            }}>
            <UnspecifiedField question={question} />
          </FormContext.Provider>
        </Form>
      )}
    </Formik>,
  );
};

describe('UnspecifiedField', () => {
  it('Should toggle the "UnspecifiedField" checkbox on click', async () => {
    // setup
    await renderForm({});
    const unspecifiedCheckbox = screen.getByRole('checkbox', { name: /UnspecifiedField/ });

    // assert initial state
    expect(unspecifiedCheckbox).not.toBeChecked();

    // assert checked
    fireEvent.click(unspecifiedCheckbox);
    expect(unspecifiedCheckbox).toBeChecked();

    // assert unchecked
    fireEvent.click(unspecifiedCheckbox);
    expect(unspecifiedCheckbox).not.toBeChecked();
  });
});
