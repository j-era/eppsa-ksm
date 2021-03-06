import {
  RESUME_OR_NEW_GAME_SELECTION,
  PLAYER_TYPE_SELECTION,
  INITIAL_GAME_MANUAL,
  AREA_CONFIRMATION,
  CHALLENGE_MANUAL,
  CHALLENGE_RESULT,
  CHALLENGE,
  FINISHED,
} from "../../gameStates"

import ResumeOrNewGameSelection from "./resumeOrNewGameSelection"
import AreaConfirmation from "./areaConfirmation"
import ChallengeManual from "./challengeManual"
import Challenge from "./challenge"
import ChallengeResult from "./challengeResult"
import Finished from "./finished"
import GameManual from "./gameManual"
import PlayerTypeSelection from "./playerTypeSelection"

export default {
  [RESUME_OR_NEW_GAME_SELECTION]: { render: ResumeOrNewGameSelection, showHeader: false },
  [PLAYER_TYPE_SELECTION]: { render: PlayerTypeSelection, showHeader: false },
  [INITIAL_GAME_MANUAL]: { render: GameManual, showHeader: true },
  [AREA_CONFIRMATION]: { render: AreaConfirmation, showHeader: true },
  [CHALLENGE_MANUAL]: { render: ChallengeManual, showHeader: true },
  [CHALLENGE]: { render: Challenge, showHeader: false },
  [CHALLENGE_RESULT]: { render: ChallengeResult, showHeader: true },
  [FINISHED]: { render: Finished, showHeader: false },
  GAME_MANUAL: { render: GameManual, showHeader: true }
}
