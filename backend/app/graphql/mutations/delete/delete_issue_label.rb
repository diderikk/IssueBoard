module Mutations
	class Delete::DeleteIssueLabel < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "DeleteIssueLabel"
		argument :issue_label_id, ID, required: true

		field :success, Boolean, null: false

		def resolve(issue_label_id:)
			issue_label = IssueLabel.includes(:issue_board, :issues).find(issue_label_id);
			open_issue_label = issue_label.issue_board.issue_labels.find_by(name: "Open");

			if !open_issue_label
				open_issue_label = issue_label.issue_board.issue_labels.find_by(name: "Closed");
			end

			if open_issue_label
				Issue.transaction do
					issue_label.issues.each do |issue|
						issue.issue_label = open_issue_label;
						issue.save!
					end
				end;
			end

			issue_label.issues.clear;


			if issue_label.destroy
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end

		private

		def authorized?(issue_label_id:)
			issue_label_authorized?(nil, issue_label_id, context);
		end

	end
end