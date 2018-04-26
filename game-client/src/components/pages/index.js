import {
  RESUME_OR_NEW_GAME_SELECTION,
  NEW_GAME_AVATAR_SELECTION,
  NEW_GAME_AVATAR_CONFIRMATION,
  NEW_GAME_NAME_SELECTION,
  INITIAL_GAME_MANUAL,
  NAVIGATION_TO_START,
  NAVIGATION_TO_NEXT_AREA,
  QR_READER,
  AREA_CONFIRMATION,
  CHALLENGE_SELECTION,
  CHALLENGE_MODE_SELECTION,
  CHALLENGE_LOBBY,
  CHALLENGE_MANUAL,
  CHALLENGE,
  FINISHED
} from "../../gameStates"

import ResumeOrNewGameSelection from "./resumeOrNewGameSelection"
import NewGameAvatarSelection from "./newGameAvatarSelection"
import NewGameAvatarConfirmation from "./newGameAvatarConfirmation"
import NewGameNameSelection from "./newGameNameSelection"
import NavigationToStart from "./navigationToStart"
import NavigationToNextArea from "./navigationToNextArea"
import QrReader from "./qrReader"
import AreaConfirmation from "./areaConfirmation"
import ChallengeSelection from "./challengeSelection"
import ChallengeModeSelection from "./challengeModeSelection"
import ChallengeLobby from "./challengeLobby"
import ChallengeManual from "./challengeManual"
import Challenge from "./challenge"
import Finished from "./finished"
import GameManual from "./gameManual"

export default {
  [RESUME_OR_NEW_GAME_SELECTION]: { render: ResumeOrNewGameSelection, showHeader: false },
  [NEW_GAME_AVATAR_SELECTION]: { render: NewGameAvatarSelection, showHeader: false },
  [NEW_GAME_AVATAR_CONFIRMATION]: { render: NewGameAvatarConfirmation, showHeader: false },
  [NEW_GAME_NAME_SELECTION]: { render: NewGameNameSelection, showHeader: false },
  [INITIAL_GAME_MANUAL]: { render: GameManual, showHeader: true },
  [NAVIGATION_TO_START]: { render: NavigationToStart, showHeader: false },
  [NAVIGATION_TO_NEXT_AREA]: { render: NavigationToNextArea, showHeader: true },
  [QR_READER]: { render: QrReader, showHeader: true },
  [AREA_CONFIRMATION]: { render: AreaConfirmation, showHeader: true },
  [CHALLENGE_SELECTION]: { render: ChallengeSelection, showHeader: true },
  [CHALLENGE_MODE_SELECTION]: { render: ChallengeModeSelection, showHeader: true },
  [CHALLENGE_LOBBY]: { render: ChallengeLobby, showHeader: true },
  [CHALLENGE_MANUAL]: { render: ChallengeManual, showHeader: true },
  [CHALLENGE]: { render: Challenge, showHeader: false },
  [FINISHED]: { render: Finished, showHeader: false },
  GAME_MANUAL: { render: GameManual, showHeader: true }
}
