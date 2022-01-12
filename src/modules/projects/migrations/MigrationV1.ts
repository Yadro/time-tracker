import { ProjectDataV0, ProjectDataV1 } from '../types';

export default function migration(data: ProjectDataV0): ProjectDataV1 {
  return {
    __version: 1,
    data,
  };
}
