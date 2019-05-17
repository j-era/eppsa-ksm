import {
  RESUME_OR_NEW_GAME_SELECTION,
  NEW_GAME_NAME_SELECTION,
  INITIAL_GAME_MANUAL,
  NAVIGATION_TO_NEXT_AREA,
  AREA_CONFIRMATION,
  CHALLENGE_SELECTION,
  CHALLENGE_MODE_SELECTION,
  CHALLENGE_MANUAL,
  CHALLENGE,
  FINISHED
} from "../../gameStates"

import ResumeOrNewGameSelection from "./resumeOrNewGameSelection"
import NewGameNameSelection from "./newGameNameSelection"
import NavigationToNextArea from "./navigationToNextArea"
import AreaConfirmation from "./areaConfirmation"
import ChallengeSelection from "./challengeSelection"
import ChallengeModeSelection from "./challengeModeSelection"
import ChallengeManual from "./challengeManual"
import Challenge from "./challenge"
import Finished from "./finished"
import GameManual from "./gameManual"

export default {
  [RESUME_OR_NEW_GAME_SELECTION]: { render: ResumeOrNewGameSelection, showHeader: false },
  [NEW_GAME_NAME_SELECTION]: { render: NewGameNameSelection, showHeader: false },
  [INITIAL_GAME_MANUAL]: { render: GameManual, showHeader: true },
  [NAVIGATION_TO_NEXT_AREA]: { render: NavigationToNextArea, showHeader: true },
  [AREA_CONFIRMATION]: { render: AreaConfirmation, showHeader: true },
  [CHALLENGE_SELECTION]: { render: ChallengeSelection, showHeader: true },
  [CHALLENGE_MODE_SELECTION]: { render: ChallengeModeSelection, showHeader: true },
  [CHALLENGE_MANUAL]: { render: ChallengeManual, showHeader: true },
  [CHALLENGE]: { render: Challenge, showHeader: false },
  [FINISHED]: { render: Finished, showHeader: false },
  GAME_MANUAL: { render: GameManual, showHeader: true }
}
