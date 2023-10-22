import  { DataTypes } from 'sequelize';
import {sequelize} from '../config/db';

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalamount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  timestamps: true,
  // sequelize: db,
  tableName: 'orders'
});



export default Order;
