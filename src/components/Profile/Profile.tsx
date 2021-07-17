import React from 'react';
import { Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { createUseStyles } from 'react-jss';

import rootStore from '../../modules/RootStore';
import useModal from '../../hooks/ModalHook';
import SettingsModal from '../SettingsModal/SettingsModal';

const { settingsStore } = rootStore;

const Profile: React.VFC = () => {
  const classes = useStyles();
  const { settings } = settingsStore;
  const { open, openModal, closeModal } = useModal();

  return (
    <Space className={classes.root}>
      <span className={classes.white}>{settings.currentProfile}</span>
      <SettingOutlined className={classes.white} onClick={openModal} />
      <SettingsModal visible={open} onClose={closeModal} />
    </Space>
  );
};

const useStyles = createUseStyles({
  root: {
    marginLeft: 16,
  },
  white: {
    color: 'white',
  },
});

export default Profile;
