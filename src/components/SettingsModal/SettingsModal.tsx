import React, { useCallback, useState } from 'react';
import { Form, Modal, Select, Space, TimePicker } from 'antd';
import { observer } from 'mobx-react';
// eslint-disable-next-line import/named
import moment, { Moment } from 'moment';

import rootStore from '../../modules/RootStore';
import IModalProps from '../../types/IModalProps';
import NewProfilePopover from './NewProfilePopover';
import { timeToMs } from '../../helpers/DateTime';
import { DEFAULT_SETTINGS } from '../../modules/settings/models/SettingsModel';

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
      });
      onClose();
    }, [profile, workingHours, onClose]);

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

    return (
      <Modal
        title="Settings"
        visible={visible}
        // okButtonProps={{ disabled: !valid }}
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
        <Form.Item label="Number of working hours">
          <TimePicker
            value={workingHours}
            onChange={(value) => setWorkingHours(value)}
            format={timeFormat}
            minuteStep={5}
            showNow={false}
            allowClear={false}
          />
        </Form.Item>
      </Modal>
    );
  }
);

export default SettingsModal;
