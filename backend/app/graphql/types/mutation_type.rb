module Types
	class MutationType < GraphQL::Schema::Object
		field :create_user, mutation: Mutations::Create::CreateUser
		field :create_group, mutation: Mutations::Create::CreateGroup
		field :create_issue_board, mutation: Mutations::Create::CreateIssueBoard
		field :create_issue_label, mutation: Mutations::Create::CreateIssueLabel
		field :create_issue, mutation: Mutations::Create::CreateIssue
	end
end