module Types
	class QueryType < GraphQL::Schema::Object
		include Authentication
		include Authorize

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

			if group_authorized?(nil, group_id, context)
				Group.find(group_id);
			else
				raise GraphQL::ExecutionError, "Not authorized for group whit id: #{group_id}"
			end
		end

		def groups
			context[:current_user].groups.where(members: {accepted: true});
		end

		def issue_board(issue_board_id:)
			if issue_board_authorized?(issue_board_id, context)
				IssueBoard.find(issue_board_id);
			else
				raise GraphQL::ExecutionError, "Not authorized for issue board with id: #{issue_board_id}"	
			end
		end

		def not_group_issue_boards
			context[:current_user].issue_boards
		end

		def issue(issue_id:)
			if issue_authorized?(issue_id, context)
				Issue.find(issue_id)
			else
				raise GraphQL::ExecutionError, "Not authorized for issue with id: #{issue_id}"
			end
		end

		# def login(email:, password:)
		# 	access_token = authenticate(email, password)
		# 	return access_token unless access_token.nil?

		# 	raise GraphQL::ExecutionError.new "Email or password wrong"
		# end
	end
end