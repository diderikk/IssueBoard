module Mutations
	class MoveIssue < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "MoveIssue"
		argument :issue_label_id, ID, required: true
		argument :issue_id, ID, required: true, loads: Issue

		field :success, Boolean, null: false

		def resolve(issue_label_id:, issue:)
			(raise GraphQL::ExecutionError.new "No group with that id") if issue.nil?

			issue_board = IssueBoard.joins(:issue_labels).where(issue_labels: {id: issue.issue_label_id}).take;
			return { success: false } unless issue_board.issue_labels.any? { |label| label.id.to_s == issue_label_id }
				
			
			

			if issue.update(issue_label_id: issue_label_id)
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end
		
		def load_issue(id)
			Issue.find(id)
		end

		private

		def authorized?(issue_label_id:, issue:)
			issue_authorized?(issue.id, context);
		end

	end
end