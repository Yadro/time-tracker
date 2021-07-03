import AbstractModel from '../../../base/AbstractModel';

export default class SettingsModel extends AbstractModel {
  currentProfile: string | null = null;
  profiles: string[] | null = null;
  hoursInWorkingDay: number | null = null;

  constructor(data: any) {
    super();
    this.load(data);
  }
}
