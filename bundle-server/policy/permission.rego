package permission

import data.role_permissions # // import role_permissions from data.json

# // default to not allow
default allow = false

allow {
    role := input.subject.roles[_] # // for every input roles
    permissions := role_permissions[role] # // get permission of the role
    permission := permissions[_] # // for every permission
    permission == {"action": input.action, "object": input.object} # // allow = true when input action and object matches
}
