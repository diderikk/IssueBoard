module Mutations
	class Create::CreateIssue < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "CreateIssue"
		argument :attributes, Types::Input::IssueInputType, required: true

		field :issue, Types::IssueType, null: true
		field :errors, [String], null: true

		def resolve(attributes:)
			issue = Issue.new(title: attributes.title, description: attributes.description, due_date: attributes.due_date, issue_label_id: attributes.issue_label_id)
			issue.order = 1;

			issue_board_id = IssueBoard.joins(:issue_labels).where(issue_labels: {id: attributes.issue_label_id}).take.id;
			last_issue = Issue.joins(:issue_label).where(issue_label: {issue_board_id: issue_board_id}).last
			issue.issue_id = (last_issue.nil?) ? 1 : last_issue.issue_id+1;

			issue_label = IssueLabel.includes(:issues).find(attributes.issue_label_id);


			Issue.transaction do
				if issue.save!
					issue_label.issues.each do |issue|
						issue.order += 1;
						issue.save;
					end
					
					{
						issue: issue,
						errors: nil,
					}
				else
					{
						issue: nil,
						errors: issue.errors.full_messages,
					}
				end
			end
		end

		private

		def authorized?(attributes:)
			issue_board = IssueBoard.joins(:issue_labels).where(issue_labels: {id: attributes.issue_label_id }).take
			issue_board_authorized?(issue_board.id, context);
		end
	end
end