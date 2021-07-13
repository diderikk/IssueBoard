module Mutations
	class MoveIssueLabel < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "MoveIssueLabel"
		argument :issue_label_id, ID, required: true, loads: IssueLabel
		argument :new_order, Int, required: true

		field :success, Boolean, null: false

		def resolve(issue_label:, new_order:)
			(raise GraphQL::ExecutionError.new "No label with that id") if issue_label.nil?

			return {success: false} if new_order == issue_label.order


			issue_board = IssueBoard.joins(:issue_labels).where(issue_labels: {id: issue_label.id }).take;
			issue_labels_in_board = issue_board.issue_labels

			if issue_labels_in_board
				IssueLabel.transaction do
					issue_labels_in_board.each do |label|
						if(label.order < issue_label.order && label.order >= new_order) 
							label.order += 1;
						elsif(label.order > issue_label.order && label.order <= new_order) 
							label.order -= 1;
						end
						label.save;
					end
				end
			end


			if issue_label.update(order: new_order);
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end
		
		def load_issue_label(id)
			IssueLabel.find(id)
		end

		private

		def authorized?(issue_label:, new_order:)
			issue_label_authorized?(issue_label, nil, context);
		end

	end
end