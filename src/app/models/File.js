import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }
}

export default File;
