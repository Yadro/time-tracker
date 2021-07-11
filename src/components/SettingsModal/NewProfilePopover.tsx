import React, { ChangeEvent, useCallback, useState } from 'react';
import { Button, Input, Popover, Space } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

import rootStore from '../../modules/RootStore';

interface INewProfilePopoverProps {
  visible: boolean;
  onChange: (visible: boolean, profile?: string) => void;
}

const { settingsStore } = rootStore;

const NewProfilePopover: React.FC<INewProfilePopoverProps> = (
  props: INewProfilePopoverProps
) => {
  const { visible, onChange } = props;

  const [profile, setProfile] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const isProfileValid = useCallback((profile: string) => {
    if (!/^[\w\d ]{2,}$/.test(profile)) {
      return false;
    }
    return !settingsStore.settings.profiles.includes(profile);
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const profile = event.target.value;
      setProfile(profile);
      setIsValid(isProfileValid(profile));
    },
    [isProfileValid]
  );

  const handleCreate = useCallback(() => {
    settingsStore.addProfile(profile);
    onChange(false, profile);
    setProfile('');
  }, [profile, onChange]);

  return (
    <Popover
      content={
        <Space>
          <Input
            placeholder="Enter a new profile name"
            value={profile}
            onChange={handleChange}
          />
          <Button type="primary" disabled={!isValid} onClick={handleCreate}>
            Create
          </Button>
        </Space>
      }
      title="Create a new profile"
      trigger="click"
      visible={visible}
      onVisibleChange={onChange}
    >
      <Button type="primary">
        <UserAddOutlined />
      </Button>
    </Popover>
  );
};

export default NewProfilePopover;
