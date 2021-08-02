# simple allow
opa eval -f pretty -i policy/simple_allow_input.json -d policy/simple.rego "data.simple.allow"

# simple not allow
opa eval -f pretty -i policy/simple_notallow_input.json -d policy/simple.rego "data.simple.allow"

# permission allow
opa eval -f pretty -i policy/permission_allow_input.json -d policy/data.json -d policy/permission.rego "data.permission.allow"

# permission not allow
opa eval -f pretty -i policy/permission_notallow_input.json -d policy/data.json -d policy/permission.rego "data.permission.allow"