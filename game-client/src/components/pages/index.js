import {
  RESUME_OR_NEW_GAME_SELECTION,
  NEW_GAME_AVATAR_SELECTION,
  NEW_GAME_AVATAR_CONFIRMATION,
  NEW_GAME_NAME_SELECTION,
  NAVIGATION_TO_START,
  NAVIGATION_TO_NEXT_CHALLENGE,
  QR_READER,
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
import NavigationToNextChallenge from "./navigationToNextChallenge"
import QrReader from "./qrReader"
import ChallengeModeSelection from "./challengeModeSelection"
import ChallengeLobby from "./challengeLobby"
import ChallengeManual from "./challengeManual"
import Challenge from "./challenge"
import Finished from "./finished"

export default {
  [RESUME_OR_NEW_GAME_SELECTION]: { render: ResumeOrNewGameSelection, showHeader: false },
  [NEW_GAME_AVATAR_SELECTION]: { render: NewGameAvatarSelection, showHeader: false },
  [NEW_GAME_AVATAR_CONFIRMATION]: { render: NewGameAvatarConfirmation, showHeader: false },
  [NEW_GAME_NAME_SELECTION]: { render: NewGameNameSelection, showHeader: false },
  [NAVIGATION_TO_START]: { render: NavigationToStart, showHeader: false },
  [NAVIGATION_TO_NEXT_CHALLENGE]: { render: NavigationToNextChallenge, showHeader: true },
  [QR_READER]: { render: QrReader, showHeader: true },
  [CHALLENGE_MODE_SELECTION]: { render: ChallengeModeSelection, showHeader: true },
  [CHALLENGE_LOBBY]: { render: ChallengeLobby, showHeader: true },
  [CHALLENGE_MANUAL]: { render: ChallengeManual, showHeader: true },
  [CHALLENGE]: { render: Challenge, showHeader: false },
  [FINISHED]: { render: Finished, showHeader: false }
}
