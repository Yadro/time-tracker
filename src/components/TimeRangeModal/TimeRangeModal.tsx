import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, TimePicker } from 'antd';
import { Moment } from 'moment/moment';
import moment from 'moment';
import { DeleteFilled, SaveOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import isBefore from 'date-fns/isBefore';

import rootStore from '../../modules/RootStore';
import TaskTimeItemModel from '../../modules/tasks/models/TaskTimeItemModel';
import { ITimeRangeModel } from '../../modules/tasks/models/TaskModel';
import { Undefined } from '../../types/CommonTypes';
import TimeRangeDuration from './components/TimeRangeDuration';
import IModalProps from '../../types/IModalProps';

const { tasksStore } = rootStore;

enum RangeField {
  start = 'start',
  end = 'end',
}

interface TimeRangeModalProps extends IModalProps {
  taskTime?: TaskTimeItemModel;
}

const TimeRangeModal = observer(
  ({ taskTime, visible, onClose }: TimeRangeModalProps) => {
    const [valid, setValid] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [timeRange, setTimeRange] = useState<Undefined<ITimeRangeModel>>();
    const timeInProgress = !taskTime?.time.end;

    const handleOk = useCallback(() => {
      if (taskTime?.task && timeRange?.start) {
        const { task, index } = taskTime;
        timeRange.description = description;
        tasksStore.setTime(task, index, timeRange);
      }
      onClose();
    }, [description, onClose, taskTime, timeRange]);

    useEffect(() => {
      function keyupHandler(e: KeyboardEvent) {
        // Hotkey: Ctrl+Enter
        if (e.ctrlKey && e.key === 'Enter') {
          handleOk();
        }
      }

      document.addEventListener('keyup', keyupHandler);
      return () => {
        document.removeEventListener('keyup', keyupHandler);
      };
    }, [handleOk]);

    useEffect(() => {
      setValid(
        !!timeRange?.start ||
          !!(
            timeRange?.start &&
            timeRange?.end &&
            isBefore(timeRange?.start, timeRange?.end)
          )
      );
    }, [timeRange]);

    useEffect(() => {
      if (taskTime) {
        setTimeRange({ ...taskTime.time });
        setDescription(taskTime.time.description || '');
      }
    }, [taskTime]);

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
        okButtonProps={{ icon: <SaveOutlined />, disabled: !valid }}
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
                  minuteStep={5}
                  value={timeRange?.start && moment(timeRange?.start)}
                  onChange={onChange(RangeField.start)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="End" labelCol={{ span: 24 }}>
                <TimePicker
                  format="HH:mm"
                  minuteStep={5}
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
  }
);

export default TimeRangeModal;
