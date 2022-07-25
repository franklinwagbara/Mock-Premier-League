import {Schema, model} from 'mongoose';

const TeamSchema = new Schema({
  name: {type: String, required: true},
  fixtures: [{type: Schema.Types.ObjectId, refs: 'Fixture'}],
});

const TeamModel = model('Team', TeamSchema);

export {TeamModel};
