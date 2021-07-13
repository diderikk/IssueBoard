module Mutations
	class Delete::DeleteIssue < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "DeleteIssue"
		argument :issue_id, ID, required: true

		field :success, Boolean, null: false

		def resolve(issue_id:)
			issue = Issue.find(issue_id);

			issue_label = IssueLabel.joins(:issues).find(issue.issue_label_id);
			issues_with_higher_order = issue_label.issues.select { |issueTemp| issueTemp.order > issue.order }

			issues_with_higher_order = [] unless issues_with_higher_order

			Issue.transaction do 
				issues_with_higher_order.each do |tempIssue|
					tempIssue.order -= 1;
					tempIssue.save;
				end
				if Issue.destroy(issue_id)
					{
						success: true
					}
				else
					{
						success: false
					}
				end
			end

			
		end

		private

		def authorized?(issue_id:)
			issue_authorized?(issue_id, context);
		end

	end
end