import React, { useState } from 'react';
import { Col, Form, Modal, Row, Select, Space } from 'antd';
import { createUseStyles } from 'react-jss';

import rootStore from '../../modules/RootStore';
import IModalProps from '../../types/IModalProps';
import NewProfilePopover from './NewProfilePopover';

const { settingsStore } = rootStore;

interface ISettingsModalProps extends IModalProps {}

const SettingsModal: React.VFC<ISettingsModalProps> = (
  props: ISettingsModalProps
) => {
  const { visible, onClose } = props;
  const [showNewProfilePopover, setShowNewProfilePopover] = useState<boolean>(
    false
  );

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
        <Col span={24}>
          <Form.Item label="Profile" labelCol={{ span: 24 }}>
            <Space>
              <Select>
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
};

const useStyles = createUseStyles({});

export default SettingsModal;
