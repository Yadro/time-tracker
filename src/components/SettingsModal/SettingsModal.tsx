import React, { useCallback, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Modal,
  Select,
  Space,
  TimePicker,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { SaveOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import * as Sentry from '@sentry/browser';
// eslint-disable-next-line import/named
import moment, { Moment } from 'moment';

import rootStore from '../../modules/RootStore';
import IModalProps from '../../types/IModalProps';
import NewProfilePopover from './NewProfilePopover';
import { timeToMs } from '../../helpers/DateTime';
import { DEFAULT_SETTINGS } from '../../modules/settings/models/SettingsModel';
import AbstractFileRepository from '../../base/repositories/AbstractFileRepository';

const { settingsStore } = rootStore;

interface ISettingsModalProps extends IModalProps {}

const timeFormat = 'HH:mm';

const SettingsModal: React.VFC<ISettingsModalProps> = observer(
  (props: ISettingsModalProps) => {
    const { visible, onClose } = props;
    const { settings } = settingsStore;

    const [showNewProfilePopover, setShowNewProfilePopover] = useState<boolean>(
      false
    );
    const [showNotifications, setShowNotifications] = useState<boolean>(
      settings.showNotifications
    );
    const [profile, setProfile] = useState<string>(settings.currentProfile);
    const [workingHours, setWorkingHours] = useState<Moment | null>(
      moment(settings.numberOfWorkingHours).utcOffset(0)
    );

    const handleSave = useCallback(() => {
      settingsStore.setSettings({
        currentProfile: profile,
        numberOfWorkingHours: workingHours
          ? timeToMs(workingHours?.toDate())
          : DEFAULT_SETTINGS.numberOfWorkingHours,
        showNotifications,
      });
      onClose();
    }, [profile, workingHours, showNotifications, onClose]);

    const handleChangeProfile = useCallback((selected: string) => {
      setProfile(selected);
    }, []);

    const handleCreateProfile = useCallback(
      (visible: boolean, profile?: string) => {
        setShowNewProfilePopover(visible);
        if (profile) {
          setProfile(profile);
        }
      },
      []
    );

    const handleChangeNotifications = useCallback((e: CheckboxChangeEvent) => {
      setShowNotifications(e.target.checked);
    }, []);

    return (
      <Modal
        title="Settings"
        visible={visible}
        // okButtonProps={{ disabled: !valid }}
        okButtonProps={{ icon: <SaveOutlined /> }}
        okText="Save"
        onOk={handleSave}
        onCancel={onClose}
      >
        <Form.Item label="Switch profile" labelCol={{ span: 24 }}>
          <Space>
            <Select
              value={profile}
              onChange={handleChangeProfile}
              style={{ width: 200 }}
            >
              {settings.profiles.map((profile) => (
                <Select.Option key={profile} value={profile}>
                  {profile}
                </Select.Option>
              ))}
            </Select>
            <NewProfilePopover
              visible={showNewProfilePopover}
              onChange={handleCreateProfile}
            />
          </Space>
        </Form.Item>
        <Divider />
        <Form.Item label="Amount of working hours" labelCol={{ span: 10 }}>
          <TimePicker
            value={workingHours}
            onChange={(value) => setWorkingHours(value)}
            format={timeFormat}
            minuteStep={5}
            showNow={false}
            allowClear={false}
          />
        </Form.Item>
        <Form.Item label="Notifications" labelCol={{ span: 10 }}>
          <Checkbox
            checked={showNotifications}
            onChange={handleChangeNotifications}
          />
        </Form.Item>
        {process.env.DEBUG_PROD === 'true' && (
          <Button
            onClick={() => {
              const message = `${process.env.NODE_ENV} exception ${Date.now()}`;
              Sentry.captureException(new Error(message));
              console.log('Sentry.captureException', message);
            }}
          >
            Test Sentry
          </Button>
        )}
        {process.env.NODE_ENV === 'development' ||
          (process.env.DEBUG_PROD === 'true' && (
            <>
              <p>{`APPDATA: ${AbstractFileRepository.appDataFolder}`}</p>
              <p>{`SENTRY_DSN: ${process.env.SENTRY_DSN}`}</p>
              <p>{`GA_UACODE: ${process.env.GA_UACODE}`}</p>
            </>
          ))}
      </Modal>
    );
  }
);

export default SettingsModal;
