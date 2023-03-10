local ret_status="%(?:%{$fg_bold[green]%}➜ :%{$fg_bold[red]%}➜ )"
local username_command="%n"
local hostname_command="%m"
local current_dir="%~"

#PROMPT='${ret_status} %{$fg[cyan]%}$username_command@$hostname_command:%{$FG[032]%}$current_dir%{$reset_color%} $(git_prompt_info)%{$fg[magenta]%}>> %{$reset_color%}'

PROMPT='${ret_status} %{$fg[cyan]%}$username_command@$hostname_command:%{$FG[032]%}$current_dir %{$fg[green]%}>> %{$reset_color%}'

ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg_bold[blue]%}git:(%{$fg[red]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%} "
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[blue]%}) %{$fg[yellow]%}✗"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$fg[blue]%})"
