import {Schema, model} from 'mongoose';

const FixtureSchema = new Schema({
  title: {type: String, required: true},
  home_team: {type: Schema.Types.ObjectId, refs: 'Team', required: true},
  away_team: {type: Schema.Types.ObjectId, refs: 'Team', required: true},
  status: {type: String, required: true},
});

const FixtureModel = model('Fixture', FixtureSchema);

export {FixtureModel};
