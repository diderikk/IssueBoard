module Types
	class QueryType < GraphQL::Schema::Object
		include Authentication

		field :login, String, null: false do
			description "Login user return tokens"

			argument :email, String, required: true
			argument :password, String, required: true
		end

		field :current_user, Types::UserType, null: true do
			description "Returns currently logged in user"
		end

		field :group, Types::GroupType, null:false do
			description "Returns a single Group that a user is a part of"

			argument :group_id, ID, required: true
		end

		field :groups, [Types::GroupType], null: false do
			description "Returns a scoped list of all groups a member is a part of"
		end

		field :issue_board, Types::IssueBoardType, null:false do
			description "Returns a single IssueBoardType that the user is a part of"

			argument :issue_board_id, ID, required: true
		end

		field :not_group_issue_boards, [Types::IssueBoardType], null: false do
			description "Returns all issueboards a user is a part of that is not in a group"
		end

		field :issue, Types::IssueType, null: false do
			description "Returns a single Issue from a IssueBoard that a user i a part of"

			argument :issue_id, ID, required: true
		end

		field :hello, String, null: false

		def hello
			"Hello"
		end

		def current_user
			context[:current_user]
		end

		def group(group_id:)
			Group.find(group_id)
		end

		def groups
			Group.all
		end

		def issue_board(issue_board_id:)
			IssueBoard.find(issue_board_id)
		end

		def not_group_issue_boards
			context[:current_user].issue_boards
		end

		def issue(issue_id:)
			Issue.find(issue_id)
		end

		# def login(email:, password:)
		# 	access_token = authenticate(email, password)
		# 	return access_token unless access_token.nil?

		# 	raise GraphQL::ExecutionError.new "Email or password wrong"
		# end
	end
end