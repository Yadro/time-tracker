import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, TimePicker } from 'antd';
import { Moment } from 'moment/moment';
import moment from 'moment';
import { DeleteFilled } from '@ant-design/icons';
import { observer } from 'mobx-react';

import './TimeRangeModal.less';

import rootStore from '../../services/RootStore';
import TaskTimeItemModel from '../../models/TaskTimeItemModel';
import { ITimeRangeModel } from '../../models/TaskModel';
import { Undefined } from '../../types/CommonTypes';
import TimeRangeDuration from './components/TimeRangeDuration';

const { tasksStore } = rootStore;

enum RangeField {
  start = 'start',
  end = 'end',
}

interface TimeRangeModalProps {
  taskTime?: TaskTimeItemModel;
  visible: boolean;
  onClose: () => void;
}

export default observer(function TimeRangeModal({
  taskTime,
  visible,
  onClose,
}: TimeRangeModalProps) {
  const [description, setDescription] = useState<string>('');
  const [timeRange, setTimeRange] = useState<Undefined<ITimeRangeModel>>();
  const timeInProgress = !taskTime?.time.end;

  useEffect(() => {
    if (taskTime) {
      setTimeRange({ ...taskTime.time });
      setDescription(taskTime.time.description || '');
    }
  }, [taskTime]);

  function handleOk() {
    if (taskTime?.task && timeRange) {
      const { task, index } = taskTime;
      if (description) {
        timeRange.description = description;
      }
      tasksStore.setTime(task, index, timeRange);
    }
    onClose();
  }

  function handleDelete() {
    if (taskTime) {
      tasksStore.deleteTime(taskTime.task, taskTime.index);
    }
    onClose();
  }

  function handleCancel() {
    onClose();
  }

  function onChange(field: RangeField) {
    return (value: Moment | null) => {
      const newTimeRange = {
        ...timeRange,
        [field]: value?.toDate() || undefined,
      };
      setTimeRange(newTimeRange as ITimeRangeModel);
    };
  }

  return (
    <Modal
      title="Edit time range"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
    >
      <Form colon>
        <Form.Item label="Task">
          <div>{taskTime?.task.title}</div>
        </Form.Item>
        <Form.Item label="Description">
          <Input
            placeholder="Type description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item label="Start" labelCol={{ span: 24 }}>
              <TimePicker
                format="HH:mm"
                value={moment(timeRange?.start)}
                onChange={onChange(RangeField.start)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="End" labelCol={{ span: 24 }}>
              <TimePicker
                format="HH:mm"
                value={timeRange?.end && moment(timeRange?.end)}
                onChange={onChange(RangeField.end)}
                disabled={timeInProgress}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Duration" labelCol={{ span: 24 }}>
              <TimeRangeDuration timeRange={timeRange} />
            </Form.Item>
          </Col>
        </Row>
        <Button icon={<DeleteFilled />} onClick={handleDelete}>
          Remove
        </Button>
      </Form>
    </Modal>
  );
});
