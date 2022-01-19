import {Sequelize, DataTypes} from 'sequelize';

export default (req, res) => {
  //コネクションの作成
  const connection = new Sequelize(
    "postgres",     //DB名
    "aduser",     //ユーザー名
    "test",     //パスワード
    {
      dialect: "postgres"  //DB製品名
    }
  );

  //モデルの定義
  const Mountain = connection.define("Mountains", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      comment: "ID"
    },
    name: {
      type: DataTypes.STRING(50),
      comment: "名",
    }
  });

  //モデルとDBの同期化
  Mountain.sync();

  //情報の取得
  Mountain.findByPk(req.query.id).then(function(value) {
    res.statusCode = 200
    res.json(value)
  });
}