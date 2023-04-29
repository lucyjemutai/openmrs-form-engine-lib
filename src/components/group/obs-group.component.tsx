import React, { useContext, useEffect, useState } from 'react';
import { getHandler } from '../../registry/registry';
import { FormContext } from '../../form-context';
import { FormFieldProps } from '../../types';
import { UnspecifiedField } from '../inputs/unspecified/unspecified.component';
import { getFieldControl, supportsUnspecified } from '../section/form-section.component';
import styles from './obs-group.scss';

export interface ObsGroupProps extends FormFieldProps {
  deleteControl?: any;
}

export const ObsGroup: React.FC<ObsGroupProps> = ({ question, onChange, deleteControl }) => {
  const [groupMembersControlMap, setGroupMembersControlMap] = useState([]);
  const { encounterContext } = useContext(FormContext);

  useEffect(() => {
    if (question.questions) {
      Promise.all(
        question.questions.map(field => {
          return getFieldControl(field)?.then(result => ({ field, control: result.default }));
        }),
      ).then(results => {
        setGroupMembersControlMap(results);
      });
    }
  }, [question.questions]);

  const groupContent = groupMembersControlMap
    .filter(groupMemberMapItem => !!groupMemberMapItem && !groupMemberMapItem.field.isHidden)
    .map((groupMemberMapItem, index) => {
      const { control, field } = groupMemberMapItem;
      if (control) {
        const questionFragment = React.createElement(control, {
          question: field,
          onChange: onChange,
          key: index,
          handler: getHandler(field.type),
        });
        return (
          <div className={`${styles.flexColumn} ${styles.obsGroupColumn} `}>
            {supportsUnspecified(field) ? (
              <>
                {questionFragment}
                <UnspecifiedField question={field} />
              </>
            ) : (
              questionFragment
            )}
          </div>
        );
      }
    });
  if (groupContent && deleteControl) {
    groupContent.push(deleteControl);
  }
  return <div className={styles.flexRow}>{groupContent}</div>;
};
