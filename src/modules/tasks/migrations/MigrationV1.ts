import { TaskDataV1, TaskDataV0 } from '../types';

export default function migration(data: TaskDataV0): TaskDataV1 {
  return {
    data,
    __version: 1,
  };
}
