import React, { useCallback, useState } from 'react';
import { Col, Form, Modal, Row, Select, Space } from 'antd';
import { createUseStyles } from 'react-jss';
import { observer } from 'mobx-react';

import rootStore from '../../modules/RootStore';
import IModalProps from '../../types/IModalProps';
import NewProfilePopover from './NewProfilePopover';

const { settingsStore } = rootStore;

interface ISettingsModalProps extends IModalProps {}

const SettingsModal: React.VFC<ISettingsModalProps> = observer(
  (props: ISettingsModalProps) => {
    const { visible, onClose } = props;

    const [showNewProfilePopover, setShowNewProfilePopover] = useState<boolean>(
      false
    );
    const [profile, setProfile] = useState<string>(
      settingsStore.settings.currentProfile
    );

    const handleSave = useCallback(() => {
      settingsStore.setActiveProfile(profile);
      onClose();
    }, [profile, onClose]);

    const handleChangeProfile = useCallback((selected: string) => {
      setProfile(selected);
    }, []);

    return (
      <Modal
        title="Settings"
        visible={visible}
        // okButtonProps={{ disabled: !valid }}
        okText="Save"
        onOk={handleSave}
        onCancel={onClose}
      >
        <Row>
          <Col span={24}>
            <Form.Item label="Profile" labelCol={{ span: 24 }}>
              <Space>
                <Select value={profile} onChange={handleChangeProfile}>
                  {settingsStore.settings.profiles.map((profile) => (
                    <Select.Option key={profile} value={profile}>
                      {profile}
                    </Select.Option>
                  ))}
                </Select>
                <NewProfilePopover
                  visible={showNewProfilePopover}
                  setVisible={setShowNewProfilePopover}
                />
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
);

const useStyles = createUseStyles({});

export default SettingsModal;
