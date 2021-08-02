# // simple.rego
package simple

# // default value
default allow = false

allow = true {
    role = input.subject.roles[_] # // each role
    role == "admin" # // allow = true if role matches "admin"
}