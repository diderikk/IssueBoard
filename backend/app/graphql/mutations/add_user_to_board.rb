module Mutations
	class AddUserToBoard < GraphQL::Schema::Mutation
		graphql_name "AddUserToBoard"

		argument :email, String, required: true
		argument :issue_board_id, ID, required: true, loads: IssueBoard

		field :success, Boolean, null: false

		def resolve(email:, issue_board:)
			user = User.find_by(email: email);
			return {success: false} if(user_email == context[:current_user].email || user.nil?) 
			issue_board.users << user

			if issue_board.save!
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end
		
		def load_issue_board(id)
  			IssueBoard.joins(:users).find(id)
		end

		private

		def authorized?(email:, issue_board:)
			issue_board.users.include? context[:current_user]
		end

		
	end
end