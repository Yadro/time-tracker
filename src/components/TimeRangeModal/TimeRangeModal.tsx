import React, { useEffect, useState } from 'react';
import { DatePicker, Modal } from 'antd';
import { Moment } from 'moment/moment';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';

import './TimeRangeModal.less';

import rootStore from '../../services/RootStore';
import TaskTimeModel from '../../models/TaskTimeModel';
import { ITimeRangeModel } from '../../models/TaskModel';
import { Undefined } from '../../types/CommonTypes';

const { RangePicker } = DatePicker;

interface TimeRangeModalProps {
  taskTime?: TaskTimeModel;
  visible: boolean;
  onClose: () => void;
}

export default function TimeRangeModal({
  taskTime,
  visible,
  onClose,
}: TimeRangeModalProps) {
  const [taskTimeItem, setTaskTimeItem] = useState(taskTime);
  const [timeRange, setTimeRange] = useState<Undefined<ITimeRangeModel>>();

  useEffect(() => {
    if (taskTime) {
      setTaskTimeItem(taskTime);
      setTimeRange({ ...taskTime.time });
    }
  }, [taskTime]);

  function handleOk() {
    if (taskTime?.task && timeRange) {
      const { task, index } = taskTime;
      task.time[index] = timeRange;
    }
    onClose();
  }

  function handleCancel() {
    onClose();
  }

  function onChange(dates: RangeValue<Moment>) {
    setTimeRange({
      start: dates?.[0]?.toDate() || new Date(),
      end: dates?.[1]?.toDate(),
      description: '',
    });
  }

  return (
    <Modal
      title="Edit time range"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
    >
      <div>Task: {taskTime?.task.title}</div>

      <RangePicker
        showTime={{ format: 'HH:mm' }}
        format="DD-MM-YYYY HH:mm"
        value={[
          moment(timeRange?.start),
          timeRange?.end ? moment(timeRange?.end) : undefined,
        ]}
        onOk={onChange}
        onChange={onChange}
      />
    </Modal>
  );
}
