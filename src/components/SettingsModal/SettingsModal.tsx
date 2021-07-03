import React from 'react';
import { Col, Form, Modal, Row, Select } from 'antd';
import { createUseStyles } from 'react-jss';

import rootStore from '../../modules/RootStore';

const { settingsStore } = rootStore;

interface ISettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.VFC<ISettingsModalProps> = (props: ISettingsModalProps) => {
  const { visible, onClose } = props;
  return (
    <Modal
      title="Settings"
      visible={visible}
      // okButtonProps={{ disabled: !valid }}
      okText="Save"
      onOk={onClose}
      onCancel={onClose}
    >
      <Row>
        <Col span={8}>
          <Form.Item label="Profile" labelCol={{ span: 24 }}>
            <Select>
              {settingsStore.settings.profiles.map((profile) => (
                <Select.Option key={profile} value={profile}>
                  {profile}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Modal>
  );
};

const useStyles = createUseStyles({});

export default SettingsModal;
