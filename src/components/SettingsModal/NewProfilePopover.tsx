import React, { ChangeEvent, useCallback, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, Input, Popover, Space } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import rootStore from '../../modules/RootStore';

interface INewProfilePopoverProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const { settingsStore } = rootStore;

const NewProfilePopover: React.FC<INewProfilePopoverProps> = (
  props: INewProfilePopoverProps
) => {
  const { visible, setVisible } = props;
  const classes = useStyles();

  const [profile, setProfile] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const isProfileValid = useCallback((profile: string) => {
    if (!/^[\w\d ]{2,}$/.test(profile)) {
      return false;
    }
    return !settingsStore.settings.profiles.includes(profile);
  }, []);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const profile = event.target.value;
    setProfile(profile);
    setIsValid(isProfileValid(profile));
  }, []);

  return (
    <Popover
      content={
        <Space>
          <Input
            placeholder="Enter a new profile name"
            value={profile}
            onChange={handleChange}
          />
          <Button type="primary" disabled={!isValid}>
            Create
          </Button>
        </Space>
      }
      title="Create a new profile"
      trigger="click"
      visible={visible}
      onVisibleChange={setVisible}
    >
      <Button type="primary">
        <UserAddOutlined />
      </Button>
    </Popover>
  );
};

const useStyles = createUseStyles({
  root: {},
});

export default NewProfilePopover;
