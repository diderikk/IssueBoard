module Types
	class MutationType < GraphQL::Schema::Object
		field :create_user, mutation: Mutations::Create::CreateUser
		field :create_group, mutation: Mutations::Create::CreateGroup
		field :create_issue_board, mutation: Mutations::Create::CreateIssueBoard
		field :create_issue_label, mutation: Mutations::Create::CreateIssueLabel
		field :create_issue, mutation: Mutations::Create::CreateIssue
		field :join_group, mutation: Mutations::JoinGroup
		field :edit_group, mutation: Mutations::Edit::EditGroup
		field :edit_issue_board, mutation: Mutations::Edit::EditIssueBoard
		field :edit_issue_label, mutation: Mutations::Edit::EditIssueLabel
		field :edit_issue, mutation: Mutations::Edit::EditIssue
		field :delete_user, mutation: Mutations::Delete::DeleteUser
		field :delete_group, mutation: Mutations::Delete::DeleteGroup
		field :delete_issue_board, mutation: Mutations::Delete::DeleteIssueBoard
		field :delete_issue_label, mutation: Mutations::Delete::DeleteIssueLabel
		field :delete_issue, mutation: Mutations::Delete::DeleteIssue
		field :login, mutation: Mutations::Login
		field :move_issue, mutation: Mutations::MoveIssue
		field :move_issue_label, mutation: Mutations::MoveIssueLabel
		field :decline_invite, mutation: Mutations::DeclineInvite
		field :accept_invite, mutation: Mutations::AcceptInvite
	end
end