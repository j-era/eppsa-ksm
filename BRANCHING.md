# The Git Workflow

* We use the Github Flow https://guides.github.com/introduction/flow/index.html
	* Master branch stays for main develop branch by convinience (Stable Mainline)
	* Create Feature Branches for Issues
	* Create Pull Requests for integration into Master

* Keep your feature branch up-to-date. Merge frequently using ```git pull --rebase origin master``` (see https://www.atlassian.com/git/tutorials/merging-vs-rebasing#the-golden-rule-of-rebasing)
	* Caution 1: Rebase creates new commits
		* Avoid overwriting the history of a branch on a remote
	* Caution 2: Resolving conflicts in a rebase can be more work than in a merge
		* The best way to minimize conflicts is to keep track of what’s happening in master, and avoid letting a topic branch run for too long without rebasing.



* Leverage a linear history, but do not rebase master branch onto another one. (This would rewrite the history of the master remote branch)
	* No merge commits
	* Backtracking
	* Bisect
	* Revert Commits
