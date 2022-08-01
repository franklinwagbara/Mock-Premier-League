import {Schema, model} from 'mongoose';
import {ITeam} from '../interfaces';

const TeamSchema = new Schema<ITeam>({
  name: {type: String, required: true},
  fixtures: [{type: Schema.Types.ObjectId, ref: 'Fixture'}],
});

const TeamModel = model<ITeam>('Team', TeamSchema);

export {TeamModel};
