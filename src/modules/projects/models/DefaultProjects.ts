import * as colors from '@ant-design/colors';
import { ProjectDataV1 } from '../types/ProjectTypeV1';
import { DEFAULT_PROJECT_ID } from '../ProjectTypes';

const DEFAULT_PROJECTS: ProjectDataV1 = {
  __version: 1,
  data: [
    // {
    //   key: DEFAULT_PROJECT_ID.MyDay,
    //   title: 'My Day',
    //   color: colors.yellow.primary || '',
    //   deletable: false,
    //   expanded: false,
    // },
    {
      key: DEFAULT_PROJECT_ID.Inbox,
      title: 'Inbox',
      color: colors.blue.primary || '',
      deletable: false,
      expanded: false,
      parent: undefined,
    },
  ],
};

export default DEFAULT_PROJECTS;
