import {Schema, model} from 'mongoose';
import {IFixture} from '../interfaces';

const FixtureSchema = new Schema<IFixture>({
  title: {type: String, required: true},
  home_team: {type: Schema.Types.ObjectId, ref: 'Team'},
  away_team: {type: Schema.Types.ObjectId, ref: 'Team'},
  status: {type: String, required: true},
});

const FixtureModel = model<IFixture>('Fixture', FixtureSchema);

export {FixtureModel};
