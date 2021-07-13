module Mutations
	class MoveIssue < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "MoveIssue"
		argument :issue_label_id, ID, required: true
		argument :issue_id, ID, required: true, loads: Issue
		argument :new_order, Int, required: false

		field :success, Boolean, null: false

		def resolve(issue_label_id:, issue:, new_order: nil)
			(raise GraphQL::ExecutionError.new "No group with that id") if issue.nil?

			if(issue_label_id != issue.issue_label_id.to_s)	
				issue_board = IssueBoard.joins(:issue_labels).where(issue_labels: {id: issue.issue_label_id}).take;
				return { success: false } unless issue_board.issue_labels.any? { |label| label.id.to_s == issue_label_id }

				new_order = 1;

				issue_label = issue_board.issue_labels.find { |label| label.id.to_s == issue_label_id };
				if(issue_label.issues)
					Issue.transaction do
						issue_label.issues.each do |issueTemp|
							issueTemp.order += 1;
							issueTemp.save;
						end
					end
				end
			else
				return { success: true } if (issue.order == new_order);
				issue_label = IssueLabel.joins(:issues).find(issue_label_id);
				Issue.transaction do
					issue_label.issues.each do |issueTemp|
						if(issueTemp.order < issue.order && issueTemp.order >= new_order) 
							issueTemp.order += 1;
						elsif(issueTemp.order > issue.order && issueTemp.order <= new_order) 
							issueTemp.order -= 1;
						end
						issueTemp.save
					end
				end
			end
					
				
			new_order = (new_order.nil?) ? issue.order : new_order;
			

			if issue.update(issue_label_id: issue_label_id, order: new_order)
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

		def authorized?(issue_label_id:, issue:, new_order: nil)
			issue_authorized?(issue.id, context);
		end

	end
end